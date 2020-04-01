create extension if not exists "uuid-ossp";

create table languages (
  "code" varchar(3) primary key,
  "nameInFinnish" varchar(50) not null unique,
  "nameInEnglish" varchar(50) not null unique
);

create type gender as enum ('female', 'male', 'other');

create table cognito_id_to_user_id_map (
  "cognitoId" varchar(100) not null unique,
  "userId" uuid not null default uuid_generate_v4() unique,
  primary key ("cognitoId", "userId")
);

create or replace function get_user_id_by_cognito_id(cognito_id varchar)
  returns uuid as
$func$
  declare result uuid;
  begin
    select "userId" into strict result from cognito_id_to_user_id_map where "cognitoId" = cognito_id;
    if not found then
      raise exception 'Matching user ID not found for provided Cognito ID';
    end if;
    return result;
  end
$func$
language plpgsql;

create table users (
  "id" uuid references cognito_id_to_user_id_map("userId") on delete cascade primary key not null,
  "email" varchar(100),
  "firstName" varchar(100),
  "description" varchar(1000),
  "gender" gender,
  "location" varchar(100),
  "isAdmin" boolean not null default false,
);

create type language_type as enum ('learning', 'spoken');
create table user_languages (
  "userId" uuid references users("id") on delete cascade not null,
  "type" language_type not null,
  "languageCode" varchar(3) references languages("code") on delete cascade not null,
  primary key ("userId", "languageCode", "type")
);

create type user_preference_type as enum ('gender');
create table user_preferences (
  "userId" uuid references users("id") on delete cascade not null,
  "type" user_preference_type not null,
  "value" varchar(100) not null,
  primary key ("userId", "type", "value")
);

create type friendship_status as enum ('requested', 'accepted', 'rejected');

create table friendships (
  "id" uuid primary key,
  "initiatorUserId" uuid references users("id") on delete cascade not null,
  "otherUserId" uuid references users("id") on delete cascade not null,
  "initiatorUserLastSeen" timestamp(3) not null default current_timestamp(3),
  "otherUserLastSeen" timestamp(3) not null default current_timestamp(3),
  "status" friendship_status not null,
  constraint different_uuids check ("initiatorUserId" != "otherUserId"),
  unique ("initiatorUserId", "otherUserId")
);

create function assert_friendship_user_id_combination_is_unique()
returns trigger as
$func$
begin
  if exists
    (
      select 1
      from friendships
      where
        "initiatorUserId" = new."initiatorUserId" and "otherUserId" = new."otherUserId"
        or "initiatorUserId" = new."otherUserId" and "otherUserId" = new."initiatorUserId"
    )
  then
    raise exception 'The combination of initiatorUserId and otherUserId must be unique';
  end if;
  return new;
end
$func$ language plpgsql;

create trigger assert_friendship_user_id_combination_is_unique_check
before insert on friendships
for each row execute procedure assert_friendship_user_id_combination_is_unique();

create table messages (
  "id" uuid primary key,
  "friendshipId" uuid references friendships("id") on delete cascade not null,
  "senderUserId" uuid references users("id") on delete cascade not null,
  "receiverUserId" uuid references users("id") on delete cascade not null,
  "sentDate" timestamp(3) not null,
  "content" varchar(10000) not null
);

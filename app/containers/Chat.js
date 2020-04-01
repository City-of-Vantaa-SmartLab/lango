import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';

import { colors, boxShadow } from 'styles';
import { sendMessage, updateUserLastSeenInFriendship } from 'store/friendships';
import { selectUserId } from 'store/user';
import { SendIcon } from 'components/icons';
import { NavigationWithTitleLinkAndBackButton } from 'components/Navigation';
import Info from 'components/Info';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
  margin: -1rem;
`;

const MessagesListBox = styled.div`
  list-style: none;
  width: 100%;
  padding: 1rem 1rem 0 1rem;
  margin-top: auto;
  overflow-y: auto;
`;

const MessageForm = styled.form`
  align-items: center;
  background-color: ${colors.light};
  display: flex;
  line-height: 3.5rem;
  margin-left: -1px; /* To make the left border on the input overflow on narrow screens */
  z-index: 3;
 `;

const MessageInput = styled.textarea`
  border: solid ${colors.lightgrey};
  border-width: 1px 0 0 1px;
  box-sizing: content-box;
  height: 1.5rem;
  line-height: 1.5rem;
  outline: 0;
  padding: 1rem;
  resize: none;
  width: 100%;

  &:focus {
    border-color: ${colors.primary};
  }
`;

const MessageSubmitButton = styled.button`
  height: 100%;
  background-color: ${colors.primary};
  border: none;
  color: ${colors.light};
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  ${boxShadow}
  margin-bottom: 1rem;
  padding: 1.5rem;
  position: relative;
  z-index: 2;
  width: 80%;
  line-height: 1.5rem;
  white-space: pre-wrap;
  word-wrap: break-word;

  &:before {
    background-color: inherit;
    content: '';
    display: block;
    height: 20px;
    position: absolute;
    transform: rotate(-45deg);
    bottom: 20px;
    width: 20px;
    z-index: -1;
  }

  ${(props) => props.pending && css`
    opacity: 0.5;
  `}
`;

const OwnMessage = styled(Message)`
  align-self: flex-end;
  background-color: ${colors.messagePrimary};

  &:before {
    right: -10px;
  }
`;

const FriendMessage = styled(Message)`
  align-self: flex-start;
  background-color: ${colors.messageSecondary};

  &:before {
    left: -10px;
  }
`;

const ListItem = ({ isOwnMessage, message }) => (
  <MessageContainer>
    {isOwnMessage
      ? <OwnMessage pending={message.pending}>{message.content}</OwnMessage>
      : <FriendMessage>{message.content}</FriendMessage>}
  </MessageContainer>
);

ListItem.propTypes = {
  isOwnMessage: PropTypes.bool.isRequired,
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    pending: PropTypes.bool,
  }).isRequired,
};

const ListView = ({ userId, messages }) => (
  <MessagesList>
    {messages.map((message) => (
      <ListItem
        key={message.id || message.temporaryId}
        isOwnMessage={userId === message.senderUserId}
        message={message}
      />
    ))}
  </MessagesList>
);

ListView.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.string.isRequired,
};

function Chat(props) {
  const { friendship, userId } = props;
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = createRef();

  if (!friendship) {
    // Something is wrong, for example the other user has cancelled the friendship
    // and now it's no longer fetchable for this user
    return <Redirect to="/friendships" />;
  }

  const friendUserId = userId === friendship.initiatorUserId
    ? friendship.otherUserId
    : friendship.initiatorUserId;

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const onNewMessageSubmit = (event) => {
    event.preventDefault();

    if (newMessage.length === 0) {
      return;
    }

    props.sendMessage({
      id: friendship.id,
      content: newMessage,
      receiverUserId: friendUserId,
    });

    setNewMessage('');
  };

  const onNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const onNewMessageKeyDown = (event) => {
    const enterPressedWithoutShift = event.which === 13 && !event.shiftKey;

    if (enterPressedWithoutShift) {
      event.preventDefault();
      event.target.form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  useEffect(() => {
    props.updateUserLastSeenInFriendship(friendship.id);

    scrollToBottom();
  }, [friendship.messages]);

  const messageList = friendship.messages && friendship.messages.length > 0
    ? (
      <MessagesListBox ref={messagesRef}>
        <ListView userId={userId} messages={friendship.messages} />
      </MessagesListBox>
    )
    : (
      <Info>Ette ole kirjoittaneet vielä yhtään viestiä!</Info>
    );

  return (
    <>
      <NavigationWithTitleLinkAndBackButton
        to="/friendships"
        title={friendship.friend.firstName}
        titleTo={`/friendships/${friendship.id}`}
      />

      <Container>
        {messageList}

        <MessageForm onSubmit={onNewMessageSubmit}>
          <MessageInput
            id="newMessage"
            placeholder="Kirjoita viestisi tähän"
            type="text"
            value={newMessage}
            onChange={onNewMessageChange}
            onKeyDown={onNewMessageKeyDown}
          />
          <MessageSubmitButton type="submit" title="Lähetä viesti"><SendIcon /></MessageSubmitButton>
        </MessageForm>
      </Container>
    </>
  );
}

Chat.propTypes = {
  friendship: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  updateUserLastSeenInFriendship: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userId: selectUserId,
});

const mapDispatchToProps = {
  sendMessage,
  updateUserLastSeenInFriendship,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

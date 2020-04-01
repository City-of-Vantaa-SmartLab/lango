import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

import {
  faArrowLeft,
  faCheck,
  faCheckSquare,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCog,
  faComment,
  faDotCircle,
  faHandshake,
  faPaperPlane,
  faSignOutAlt,
  faSpinner,
  faSquare,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

export function AcceptIcon() {
  return <FontAwesomeIcon icon={faCheck} />;
}

export function ArrowLeftIcon() {
  return <FontAwesomeIcon icon={faArrowLeft} />;
}

export function CheckboxIcon() {
  return <FontAwesomeIcon icon={faSquare} />;
}

export function CheckboxCheckedIcon() {
  return <FontAwesomeIcon icon={faCheckSquare} />;
}

export function ChevronDownIcon() {
  return <FontAwesomeIcon icon={faChevronDown} />;
}

export function ChevronLeftIcon() {
  return <FontAwesomeIcon icon={faChevronLeft} />;
}

export function ChevronRightIcon() {
  return <FontAwesomeIcon icon={faChevronRight} />;
}

export function CogIcon() {
  return <FontAwesomeIcon icon={faCog} />;
}

export function CommentIcon() {
  return <FontAwesomeIcon icon={faComment} />;
}

export function DeclineIcon() {
  return <FontAwesomeIcon icon={faTimes} />;
}

export function FacebookIcon() {
  return <FontAwesomeIcon icon={faFacebookF} />;
}

export function HandshakeIcon() {
  return <FontAwesomeIcon icon={faHandshake} />;
}

export function LoadingIcon() {
  return <FontAwesomeIcon pulse icon={faSpinner} />;
}

export function RadioIcon() {
  return <FontAwesomeIcon icon={faCircle} />;
}

export function RadioCheckedIcon() {
  return <FontAwesomeIcon icon={faDotCircle} />;
}

export function SendIcon() {
  return <FontAwesomeIcon icon={faPaperPlane} />;
}

export function SignOutIcon() {
  return <FontAwesomeIcon icon={faSignOutAlt} />;
}

export function UsersIcon() {
  return <FontAwesomeIcon icon={faUsers} />;
}

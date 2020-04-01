import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import { colors, boxShadow } from 'styles';
import { LoadingIcon } from 'components/icons';

const DeleteModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const DeleteButton = styled.button`
  ${boxShadow}
  height: 60px;
  color: ${colors.grey};
  border: 2px solid ${colors.grey};
  border-radius: 8px;
  background-color: ${colors.light};
  width:100%;
  cursor: pointer;
`;

const Title = styled.p`
  font-weight: bold;
`;

const Description = styled.p`
  margin-bottom: auto;
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  flex-basis: 0;
  flex-grow: 1;
  font-weight: bold;
  border-radius: 8px;
  height: 40px;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  color: ${colors.dark};
  background-color: ${colors.lightgrey};
  margin-right: 0.5rem;
`;

const AcceptButton = styled(Button)`
  color: ${colors.light};
  background-color: ${colors.danger};
  margin-left: 0.5rem;
`;

function DeleteProfile({ description, deletingInProgress, onDeleteUser }) {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <>
      <DeleteButton onClick={show}>
        {deletingInProgress ? <LoadingIcon /> : 'Profiilin poistaminen'}
      </DeleteButton>

      <Rodal
        width={300}
        height={300}
        visible={visible}
        onClose={hide}
        showCloseButton={false}
      >
        <DeleteModalWrapper>
          <Title> Profiilin poistaminen </Title>
          <Description>
            {description}
          </Description>
          <ButtonBar>
            <CancelButton onClick={hide}> Peruuta </CancelButton>
            <AcceptButton onClick={onDeleteUser}> Jatka </AcceptButton>
          </ButtonBar>
        </DeleteModalWrapper>
      </Rodal>
    </>
  );
}

DeleteProfile.propTypes = {
  deletingInProgress: PropTypes.bool,
  description: PropTypes.string.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};

DeleteProfile.defaultProps = {
  deletingInProgress: false,
};

export default DeleteProfile;

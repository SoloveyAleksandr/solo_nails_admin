import React, { FC, useState } from "react";
import { Input, InputGroup, InputLeftAddon, IconButton } from '@chakra-ui/react';
import { InfoIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import styles from './FormInput.module.scss';
import DefaultBtn from "../DefaultBtn/DefaultBtn";
import Container from "../Container/Container";

interface IFormInput {
  title: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addon?: string;
  info?: string;
}

const FormInput: FC<IFormInput> = ({
  title,
  placeholder,
  value,
  onChange,
  addon,
  info,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InputGroup w={'100%'}>
        <label className={styles.label}>
          <span className={styles.title}>
            {title}
          </span>
          {info &&
            // <IconButton
            //   aria-label="info about input"
            //   icon={<InfoIcon />}
            //   className={styles.infoBtn} />
            <button
              className={styles.infoBtn}
              onClick={() => setIsOpen(true)}>
              <InfoIcon />
            </button>
          }
          <div className={styles.inputWrapper}>
            {addon &&
              <InputLeftAddon
                children='+375'
                className={styles.phoneAddon} />}
            <Input
              className={addon ? `${styles.input} ${styles.addon}` : styles.input}
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(e)} />
          </div>
        </label>
      </InputGroup>
      {info &&
        <Container>
          <Modal
            onClose={() => setIsOpen(false)}
            isOpen={isOpen}
            isCentered>
            <ModalOverlay />
            <ModalContent w={'calc(100% - 30px)'}>
              <ModalHeader />
              <ModalCloseButton />
              <ModalBody>
                <p className={styles.infoText}>{info}</p>
              </ModalBody>
              <ModalFooter>
                <DefaultBtn
                  type={'button'}
                  value="понятно"
                  handleClick={() => setIsOpen(false)} />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      }
    </>
  );
};

export default FormInput;

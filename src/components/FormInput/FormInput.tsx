import React, { FC, useState } from "react";
import { Input, InputGroup, InputLeftAddon, IconButton } from '@chakra-ui/react';
import { InfoIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
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

  return (
    <InputGroup w={'100%'}>
      <label className={styles.label}>
        <span className={styles.title}>
          {title}
        </span>
        {info &&
          <Popover placement='auto-start'>
            <PopoverTrigger>
              <button
                type="button"
                className={styles.infoBtn}>
                <InfoIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader></PopoverHeader>
              <PopoverBody>{info}</PopoverBody>
            </PopoverContent>
          </Popover>
        }
        <div className={styles.inputWrapper}>
          {addon &&
            <InputLeftAddon
              bgColor={'rgba(255, 255, 255, 0.5)'}
              fontSize={'14px'}
              className={styles.phoneAddon}
              children='+375' />}
          <Input
            className={addon ? `${styles.input} ${styles.addon}` : styles.input}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e)} />
        </div>
      </label>
    </InputGroup>
  );
};

export default FormInput;

/**
 * This is a reusable component for showing a scrollable list of exercises
 * and it should currently be used within the Side Menu.
 */
import React, { memo } from "react";
import styled from "styled-components";

const Container = styled.div``;

const ListHeader = styled.div`
  font-size: 12px;
  color: ${p => p.theme.grey["500"]};
  text-transform: uppercase;
  text-align: center;
  padding-top: 25px;
  padding-bottom: 20px;
`;

const ListItem = {
  container: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    font-size: 13px;
    margin-left: 22px;
    margin-right: 17px;
    border-bottom: ${p => p.theme.grey["200"]} 1px solid;

    &:hover,
    :focus {
      opacity: 0.5;
      cursor: pointer;
    }
  `,
  bottomLine: styled.div`
    opacity: 0.2;
  `,
  leftCol: styled.div`
    flex: 3;
  `,
  rightCol: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `
};

const PrimaryText = styled.div`
  color: ${p => p.theme.white};
  margin-bottom: 5px;
`;

const SecondaryText = styled.div`
  color: ${p => p.theme.grey["500"]};
`;

export type ListItem = {
  id: number;
  name: string;
  highestWeight: number;
};
export interface ExerciseListProps {
  title: string;
  data: ListItem[];
  onItemClick: (item: ListItem) => void;
}
export const ExerciseList: React.FC<ExerciseListProps> = memo(
  ({ title, data, onItemClick }) => {
    const onClick = (item: ListItem) => () => onItemClick(item);

    return (
      <Container>
        <ListHeader>{title}</ListHeader>
        {data.map((item, i) => {
          return (
            <ListItem.container key={item.name + i} onClick={onClick(item)}>
              <ListItem.leftCol>
                <PrimaryText style={{ fontSize: "15px" }}>
                  {item.name}
                </PrimaryText>
                <SecondaryText>{"1 RM Record"}</SecondaryText>
              </ListItem.leftCol>
              <ListItem.rightCol>
                <PrimaryText>{item.highestWeight.toFixed(2)}</PrimaryText>
                <SecondaryText>lbs</SecondaryText>
              </ListItem.rightCol>
            </ListItem.container>
          );
        })}
      </Container>
    );
  }
);

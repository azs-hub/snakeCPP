//
//  Snake.cpp
//  snake
//
//  Created by Camille Laura Rolland on 21/04/16(16).
//  Copyright © 2016 siba_a. All rights reserved.
//

#include "Snake.hpp"


Snake::Snake(int life, char direction){
    
    this->life = life;
    this->direction = direction;
}

void Snake::setLife(int life) {
    this->life = life;
}
int Snake::getLife(){
    return life;
}

void Snake::setDirection(char direction) {
    this->direction = direction;
}

char Snake::getDirection() {
    return direction;
}

Baby::Baby(int x, int y, int size)
{
    this->x = x;
    this->y = y;
    this->size = size;
}

void Baby::setX(int value) {
    this->x = value;
}

int Baby::getX() {
    return x;
}

void Baby::setY(int value) {
    this->y = value;
}

int Baby::getY() {
    return y;
}

void Baby::setSize(int value) {
    this->size = value;
}

int Baby::getSize() {
    return size;
}
//
//  Snake.hpp
//  snake
//
//  Created by Camille Laura Rolland on 21/04/16(16).
//  Copyright © 2016 siba_a. All rights reserved.
//

#ifndef Snake_hpp
#define Snake_hpp

#include <stdio.h>

class Snake
{
    public :
    Snake();
    Snake(int life, char direction);
    
    void setLife(int life);
    int getLife();
    void setDirection(char d);
    char getDirection();
    
    private :
    int life;
    char direction;
    
};

class Baby : public Snake
{
    public :
    Baby(int x, int y, int size);
    
    void setX(int value);
    int getX();
    void setY(int value);
    int getY();
    void setSize(int value);
    int getSize();
    
    private :
    int x;
    int y;
    int size;
};

#endif /* Snake_hpp */

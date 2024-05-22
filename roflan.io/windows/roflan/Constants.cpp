#include "pch.h"
#include <iostream>
#include <map>
#include <string>


const std::string API_URL = "http://192.168.1.184:8080/api/v2";
const std::string WSS_URL = "ws://192.168.1.184:8080/api/v2/";
const std::string TERMS_OF_USE = "https://termly.io/resources/templates/terms-of-service-template";
const std::string CLIENT_KEY = "veubA0AVqYjBc6Lj0PeYnm9KmJlPLrnI";
const std::string CLIENT_VALUE = "qREBmXgGN4Qlu94uZn7IflYnGFDJCQwFytLFkQ5URtumkuehfzJnrWB4qFwjUImD";


static std::map<std::string, std::string> ENVIRONMENT_VAR = {
    {"TERMS_OF_USE", TERMS_OF_USE},
    {"API_URL", API_URL},
    {"WSS_URL", WSS_URL},
    {"CLIENT_KEY", CLIENT_KEY},
    {"CLIENT_VALUE", CLIENT_VALUE},
};

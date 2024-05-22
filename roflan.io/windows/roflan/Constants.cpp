#include "pch.h"
#include <iostream>
#include <map>
#include <string>


const std::string API_URL = "http://192.168.1.184:8080/api/v2";
const std::string TERMS_OF_USE = "https://termly.io/resources/templates/terms-of-service-template";


std::map<std::string, std::string> ENVIRONMENT_VAR = {
    {"TERMS_OF_USE", TERMS_OF_USE},
    {"API_URL", API_URL}
};

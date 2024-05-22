#pragma once

#include "pch.h"
#include <functional>

#include "MainModule.cpp"

namespace MainModule
{
    static SampleModuleDecl* dec = new SampleModuleDecl();

  REACT_MODULE(MainModule);
  struct MainModule final
  {

    REACT_METHOD(Add, L"add");
    double Add(double a, double b) noexcept {
          double result = a + b;
          return result;
    }

        REACT_METHOD(GetString, L"getString");
        void GetString(React::ReactPromise<std::string>&& result) noexcept {
            result.Resolve((*dec).GetString());
        }

        REACT_METHOD(WriteFile, L"writeFile");
        void WriteFile(std::string const path, std::string const name, const std::string content, React::ReactPromise<std::string>&& result) noexcept {
          writeFileThread(path, name, content);
          result.Resolve("true");
        }
        
        REACT_METHOD(showToastNotification, L"showToastNotification");
        void showToastNotification(std::string const label, std::string const body, React::ReactPromise<bool>&& result) noexcept {
            (*dec).showToastNotification(label, body);
            result.Resolve(true);
        }
        REACT_METHOD(getEnv, L"getEnv");
        void getEnv(std::string const label, React::ReactPromise<std::string>&& result) noexcept {
            std::string env = (*dec).getEnv(label);
            result.Resolve(env);
        }
  };
}

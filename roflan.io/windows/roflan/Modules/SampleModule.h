#pragma once

#include "pch.h"
#include <functional>

#include "SampleModule.cpp"

namespace SampleModule
{
    static SampleModuleDecl* dec = new SampleModuleDecl();

  REACT_MODULE(SampleModule);
  struct SampleModule final
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
  };
}
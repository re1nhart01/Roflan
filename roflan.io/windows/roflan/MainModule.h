#pragma once

#include "pch.h"
#include <functional>

#include "MainModule.cpp"
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.UI.Core.h>
#include "winrt/Windows.UI.Xaml.h"
#include <winrt/Windows.UI.Xaml.Hosting.h>
#include <winrt/windows.storage.pickers.h>

using namespace winrt;
using namespace Windows::Foundation;
using namespace Windows::Storage;
using namespace Windows::Storage::Pickers;
using namespace Microsoft::ReactNative;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Hosting;
using namespace Windows::UI::Core;


namespace MainModule
{
    static SampleModuleDecl* dec = new SampleModuleDecl();

  REACT_MODULE(MainModule);
  struct MainModule final
  {
      winrt::Microsoft::ReactNative::ReactContext m_reactContext;

       REACT_INIT(Initialize)
        void Initialize(winrt::Microsoft::ReactNative::ReactContext const& reactContext) noexcept {
            m_reactContext = reactContext;
        }


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
        REACT_SYNC_METHOD(getEnv, L"getEnv");
        std::string getEnv(std::string const label) noexcept {
            std::string env = (*dec).getEnv(label);
            return env;
        }

        REACT_METHOD(implementPicker, L"implementPicker");
        void implementPicker(std::string result, winrt::Microsoft::ReactNative::ReactPromise<std::string> promise) noexcept {
            promise.Resolve(result);
        }


        REACT_METHOD(pick, L"pick")
            void pick(winrt::Microsoft::ReactNative::ReactPromise<std::string> promise) noexcept {
            auto prom = promise;
            m_reactContext.UIDispatcher().Post([context = this->m_reactContext, prom = std::move(prom)]()->winrt::fire_and_forget {
                auto p = prom;
                try {
                    FileOpenPicker filePicker;
                    filePicker.ViewMode(PickerViewMode::Thumbnail);
                    filePicker.SuggestedStartLocation(PickerLocationId::PicturesLibrary);
                    filePicker.FileTypeFilter().ReplaceAll({ L".jpg", L".jpeg", L".png" }); // Allowed File types
                        StorageFile file = co_await filePicker.PickSingleFileAsync();
                        if (file != nullptr) {
                            std::string fileName = winrt::to_string(file.Name());
                            p.Resolve(fileName);
                        }
                    } catch (const hresult_error& ex) {
                        p.Reject(winrt::Microsoft::ReactNative::ReactError{ "Unable to set FilePicker options", winrt::to_string(ex.message()).c_str() });
                }
                }
            );
        };
  };
}

#include "pch.h"
#include "NativeModules.h"
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include "ReactNativePickFile.hpp"
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.Storage.Pickers.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.UI.Xaml.h>
#include <winrt/Windows.UI.Xaml.Controls.h>
#include <winrt/Windows.UI.Xaml.Navigation.h>
#include <winrt/Windows.ApplicationModel.Activation.h>


using namespace winrt;
using namespace Windows::UI::Xaml;


std::string ReactNativeFileResponse::generateBoundary() {
	return "----WebKitFormBoundary7MA4YWxkTrZu0gW";
}


std::string ReactNativeFileResponse::createMultipartFormData(const std::string& boundary, const std::string& fileContent, const std::string& fileName) {
    std::ostringstream oss;

    oss << "--" << boundary << "\r\n";
    oss << "Content-Disposition: form-data; name=\"file\"; filename=\"" << fileName << "\"\r\n";
    oss << "Content-Type: application/octet-stream\r\n\r\n";
    oss << fileContent << "\r\n";
    oss << "--" << boundary << "--\r\n";

    return oss.str();
}



winrt::fire_and_forget ReactNativeFilePicker::pickL() {
    Windows::Storage::Pickers::FileOpenPicker picker;
    picker.ViewMode(Windows::Storage::Pickers::PickerViewMode::List);
    picker.SuggestedStartLocation(Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
    picker.FileTypeFilter().Append(L"*");

    Windows::Storage::StorageFile file = co_await picker.PickSingleFileAsync();

    if (file) {
        Windows::Storage::Streams::IRandomAccessStream fileStream = co_await file.OpenAsync(Windows::Storage::FileAccessMode::Read);
        Windows::Storage::Streams::DataReader reader{ fileStream.GetInputStreamAt(0) };
        uint64_t fileSize = fileStream.Size();
        co_await reader.LoadAsync(static_cast<uint32_t>(fileSize));
        std::vector<uint8_t> fileContent(fileSize);
        reader.ReadBytes(fileContent);
        reader.Close();
    } else {
    }
}
#include "pch.h"
#include "NativeModules.h"
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>


#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.Storage.Pickers.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.UI.Xaml.h>
#include <winrt/Windows.UI.Xaml.Controls.h>
#include <winrt/Windows.UI.Xaml.Navigation.h>
#include <winrt/Windows.ApplicationModel.Activation.h>


class ReactNativeFileResponse {
private:
	std::string fileName;
	std::string filePath;
	uint64_t fileSize;
	std::vector<uint8_t> fileContent;
public:

	ReactNativeFileResponse(const std::string fileName, const std::string filePath, const uint64_t fileSize, const std::vector<uint8_t> fileContent) {
		this->fileName = fileName;
		this->filePath = filePath;
		this->fileSize = fileSize;
		this->fileContent = fileContent;
	};
	std::string generateBoundary();
	std::string createMultipartFormData(const std::string& boundary, const std::string& fileContent, const std::string& fileName);
	void pushToJS(const std::string& result);
};



class ReactNativeFilePicker {
private:
public:
	ReactNativeFilePicker() {

	};
	void pickSingle(winrt::Microsoft::ReactNative::ReactPromise<std::string> promise) noexcept;
	winrt::fire_and_forget pickL();
	void pickDirectory(winrt::Microsoft::ReactNative::ReactPromise<std::string> promise) noexcept;
	void openFileAsync(const std::string& filePath);
};
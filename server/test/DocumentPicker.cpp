#include "pch.h"
#include "RNDocumentPicker.h"
#include "winrt/Windows.Foundation.Collections.h"
#include "winrt/Windows.Storage.Pickers.h"
#include "winrt/Windows.Storage.h"
#include "winrt/Windows.UI.Core.h"
#include "winrt/Windows.ApplicationModel.Core.h"
#include <regex>
#include <vector>
#include <sstream>
#include <winrt/Windows.Storage.AccessCache.h>

using namespace winrt;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::Storage;
using namespace Windows::Storage::Pickers;
using namespace Windows::UI::Core;
using namespace Windows::ApplicationModel::Core;
using namespace std::chrono_literals;

namespace RNDocumentPicker
{
    namespace {
        constexpr auto OPTION_TYPE = L"type";
        constexpr auto CACHE_TYPE = L"cache";
        constexpr auto OPTION_MULTIPLE = L"allowMultiSelection";
        constexpr auto OPTION_READ_CONTENT = L"readContent";
        constexpr auto FIELD_URI = L"uri";
        constexpr auto FIELD_FILE_COPY_URI = L"fileCopyUri";
        constexpr auto FIELD_NAME = L"name";
        constexpr auto FIELD_TYPE = L"type";
        constexpr auto FIELD_SIZE = L"size";
        constexpr auto FIELD_CONTENT = L"content";
    }

    IAsyncOperation<IVector<IInspectable>> Pick(IVectorView<IInspectable> options)
    {
        FileOpenPicker openPicker;
        openPicker.ViewMode(PickerViewMode::Thumbnail);
        openPicker.SuggestedStartLocation(PickerLocationId::DocumentsLibrary);

        // Get file type array options
        auto fileTypes = options.GetAt(0).as<IVectorView<hstring>>();

        bool cache = false;
        if (options.Size() > 1)
        {
            cache = unbox_value<bool>(options.GetAt(1));
        }

        bool isMultiple = unbox_value<bool>(options.GetAt(2));
        bool readContent = false;
        if (options.Size() > 3)
        {
            readContent = unbox_value<bool>(options.GetAt(3));
        }

        bool isFolderPicker = false;

        // Init file type filter
        if (fileTypes != nullptr)
        {
            for (auto&& type : fileTypes)
            {
                if (type == L"folder")
                {
                    isFolderPicker = true;
                    continue;
                }

                std::wregex reg(L"(^[.]+[A-Za-z0-9]*$)|(^[*]$)");
                if (std::regex_match(type.c_str(), reg))
                {
                    openPicker.FileTypeFilter().Append(type);
                }
            }
        }
        else
        {
            openPicker.FileTypeFilter().Append(L"*");
        }

        IVector<IInspectable> result = single_threaded_vector<IInspectable>();
        if (isFolderPicker)
        {
            FolderPicker folderPicker;
            folderPicker.ViewMode(PickerViewMode::List);
            folderPicker.SuggestedStartLocation(PickerLocationId::DocumentsLibrary);
            folderPicker.FileTypeFilter().Append(L"*");

            auto folderResult = co_await PickFolderAsync(folderPicker, cache, readContent);
            for (auto&& item : folderResult)
            {
                result.Append(item);
            }
        }
        else
        {
            if (isMultiple)
            {
                auto fileResult = co_await PickMultipleFileAsync(openPicker, cache, readContent);
                for (auto&& item : fileResult)
                {
                    result.Append(item);
                }
            }
            else
            {
                auto fileResult = co_await PickSingleFileAsync(openPicker, cache, readContent);
                for (auto&& item : fileResult)
                {
                    result.Append(item);
                }
            }
        }

        co_return result;
    }

    IAsyncOperation<IInspectable> PickDirectory()
    {
        CoreDispatcher dispatcher = CoreApplication::MainView().CoreWindow().Dispatcher();

        FolderPicker folderPicker;
        folderPicker.ViewMode(PickerViewMode::List);
        folderPicker.SuggestedStartLocation(PickerLocationId::DocumentsLibrary);
        folderPicker.FileTypeFilter().Append(L"*");

        StorageFolder folder = co_await folderPicker.PickSingleFolderAsync();

        JSValueObject result;
        if (folder != nullptr)
        {
            result.SetNamedValue(FIELD_URI, JSValue(folder.Path()));

            StorageApplicationPermissions::FutureAccessList().AddOrReplace(L"pickedFolderToken", folder);
        }

        co_return result;
    }

    IAsyncOperation<JSValueObject> PrepareFile(StorageFile file, bool cache, bool readContent)
    {
        hstring base64Content = L"";
        if (readContent)
        {
            auto buffer = co_await FileIO::ReadBufferAsync(file);
            DataReader dataReader = DataReader::FromBuffer(buffer);
            std::vector<uint8_t> bytes(dataReader.UnconsumedBufferLength());
            dataReader.ReadBytes(bytes);
            base64Content = CryptographicBuffer::EncodeToBase64String(buffer);
        }

        JSValueObject result;
        if (cache)
        {
            StorageFile fileInCache = co_await file.CopyAsync(ApplicationData::Current().TemporaryFolder(), file.Name(), NameCollisionOption::ReplaceExisting);
            BasicProperties basicProperties = co_await fileInCache.GetBasicPropertiesAsync();

            result.SetNamedValue(FIELD_URI, JSValue(file.Path()));
            result.SetNamedValue(FIELD_FILE_COPY_URI, JSValue(file.Path()));
            result.SetNamedValue(FIELD_TYPE, JSValue(file.ContentType()));
            result.SetNamedValue(FIELD_NAME, JSValue(file.Name()));
            result.SetNamedValue(FIELD_SIZE, JSValue(basicProperties.Size()));
            result.SetNamedValue(FIELD_CONTENT, JSValue(base64Content));
        }
        else
        {
            BasicProperties basicProperties = co_await file.GetBasicPropertiesAsync();

            result.SetNamedValue(FIELD_URI, JSValue(file.Path()));
            result.SetNamedValue(FIELD_FILE_COPY_URI, JSValue(file.Path()));
            result.SetNamedValue(FIELD_TYPE, JSValue(file.ContentType()));
            result.SetNamedValue(FIELD_NAME, JSValue(file.Name()));
            result.SetNamedValue(FIELD_SIZE, JSValue(basicProperties.Size()));
            result.SetNamedValue(FIELD_CONTENT, JSValue(base64Content));
        }

        co_return result;
    }

    IAsyncOperation<IVector<IInspectable>> PickMultipleFileAsync(FileOpenPicker picker, bool cache, bool readContent)
    {
        CoreDispatcher dispatcher = CoreApplication::MainView().CoreWindow().Dispatcher();
        auto files = co_await picker.PickMultipleFilesAsync();

        IVector<IInspectable> result = single_threaded_vector<IInspectable>();
        if (files.Size() > 0)
        {
            for (auto&& file : files)
            {
                auto processedFile = co_await PrepareFile(file, cache, readContent);
                result.Append(processedFile);
            }
        }

        co_return result;
    }

    IAsyncOperation<IVector<IInspectable>> PickSingleFileAsync(FileOpenPicker picker, bool cache, bool readContent)
    {
        CoreDispatcher dispatcher = CoreApplication::MainView().CoreWindow().Dispatcher();
        auto file = co_await picker.PickSingleFileAsync();

        IVector<IInspectable> result = single_threaded_vector<IInspectable>();
        if (file != nullptr)
        {
            auto processedFile = co_await PrepareFile(file, cache, readContent);
            result.Append(processedFile);
        }

        co_return result;
    }

    IAsyncOperation<IVector<IInspectable>> PickFolderAsync(FolderPicker picker, bool cache, bool readContent)
    {
        CoreDispatcher dispatcher = CoreApplication::MainView().CoreWindow().Dispatcher();
        auto folder = co_await picker.PickSingleFolderAsync();

        IVector<IInspectable> result = single_threaded_vector<IInspectable>();
        if (folder != nullptr)
        {
            auto files = co_await folder.GetFilesAsync();
            for (auto&& file : files)
            {
                auto preparedFile = co_await PrepareFile(file, cache, readContent);
                result.Append(preparedFile);
            }
        }

        co_return result;
    }
}

#include "iostream"
#include <exception>
#include <fstream>
#include <string>
#include <winrt/base.h>
#include <winrt/Windows.Storage.FileProperties.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.ApplicationModel.h>
#include <winrt/Windows.Data.Xml.Dom.h>
#include <winrt/Windows.UI.Notifications.h>

using namespace winrt::Windows::Storage;
using namespace winrt::Windows::Storage::Streams;
using namespace winrt::Windows::ApplicationModel;
using namespace winrt::Windows::Data::Xml::Dom;
using namespace winrt::Windows::UI::Notifications;

class SampleModuleDecl final {
  public:
    double Add(double a, double b) noexcept;
    std::string GetString();
    std::string WriteFile(const std::string fullPath, std::string const name, const std::string content);
};



std::string SampleModuleDecl::GetString() {
  std::srand(static_cast<unsigned>(std::time(0)));

  // Generate a random integer between 0 and 100
  int randomInt = std::rand() % 101;
  return std::to_string(randomInt);
}

void showToastNotification(const std::wstring& title, const std::wstring& content) {
   

    std::wstring xml = L"<toast>"
        L"    <visual>"
        L"        <binding template=\"ToastGeneric\">"
        L"            <text>" + title + L"</text>"
        L"            <text>" + content + L"</text>"
        L"        </binding>"
        L"    </visual>"
        L"</toast>";

    XmlDocument doc;
    doc.LoadXml(xml);
    ToastNotification toast(doc);
    ToastNotifier notifier = ToastNotificationManager::CreateToastNotifier();
    notifier.Show(toast);
}


void w(const std::string fullPath, const std::string name, const std::string content) {
    try {
        winrt::hstring path = winrt::to_hstring(fullPath);
        winrt::hstring v = winrt::to_hstring(name);
        winrt::hstring c = winrt::to_hstring(content);
        StorageFolder folder = StorageFolder::GetFolderFromPathAsync(path).get();
        StorageFile file = folder.CreateFileAsync(v).get();
        Streams::IRandomAccessStream stream = file.OpenAsync(FileAccessMode::ReadWrite).get();
        DataWriter writer(stream);
        writer.WriteString(c);
        writer.StoreAsync().get();
    }
    catch (const winrt::hresult_error& ex) {}
}

void writeFileThread(const std::string fullPath, const std::string name, const std::string content) {
    std::thread thread(w, fullPath, name, content);
    thread.join();
}

std::string SampleModuleDecl::WriteFile(const std::string fullPath, const std::string name, const std::string content)  {
   try {
       winrt::hstring path = winrt::to_hstring(fullPath);
       winrt::hstring v = winrt::to_hstring(name);
       winrt::hstring c = winrt::to_hstring(content);
       StorageFolder folder = StorageFolder::GetFolderFromPathAsync(path).get();
       StorageFile file = folder.CreateFileAsync(v).get();
       Streams::IRandomAccessStream stream = file.OpenAsync(FileAccessMode::ReadWrite).get();
       DataWriter writer(stream);
       writer.WriteString(c);
       writer.StoreAsync().get();
       return name + " " + content;
   } catch (const winrt::hresult_error& ex) {
        return "NULL";
   }
};
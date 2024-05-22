// AutolinkedNativeModules.g.cpp contents generated by "react-native autolink-windows"
// clang-format off
#include "pch.h"
#include "AutolinkedNativeModules.g.h"

// Includes from @react-native-async-storage/async-storage
#include <winrt/ReactNativeAsyncStorage.h>

// Includes from @react-native-community/netinfo
#include <winrt/ReactNativeNetInfo.h>

// Includes from @react-native-picker/picker
#include <winrt/ReactNativePicker.h>

// Includes from react-native-device-info
#include <winrt/RNDeviceInfoCPP.h>

// Includes from react-native-screens
#include <winrt/RNScreens.h>

// Includes from react-native-svg
#include <winrt/RNSVG.h>

// Includes from react-native-video
#include <winrt/ReactNativeVideoCPP.h>

namespace winrt::Microsoft::ReactNative
{

void RegisterAutolinkedNativeModulePackages(winrt::Windows::Foundation::Collections::IVector<winrt::Microsoft::ReactNative::IReactPackageProvider> const& packageProviders)
{ 
    // IReactPackageProviders from @react-native-async-storage/async-storage
    packageProviders.Append(winrt::ReactNativeAsyncStorage::ReactPackageProvider());
    // IReactPackageProviders from @react-native-community/netinfo
    packageProviders.Append(winrt::ReactNativeNetInfo::ReactPackageProvider());
    // IReactPackageProviders from @react-native-picker/picker
    packageProviders.Append(winrt::ReactNativePicker::ReactPackageProvider());
    // IReactPackageProviders from react-native-device-info
    packageProviders.Append(winrt::RNDeviceInfoCPP::ReactPackageProvider());
    // IReactPackageProviders from react-native-screens
    packageProviders.Append(winrt::RNScreens::ReactPackageProvider());
    // IReactPackageProviders from react-native-svg
    packageProviders.Append(winrt::RNSVG::ReactPackageProvider());
    // IReactPackageProviders from react-native-video
    packageProviders.Append(winrt::ReactNativeVideoCPP::ReactPackageProvider());
}

}

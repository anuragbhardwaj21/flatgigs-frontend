import { v4 as uuidv4 } from "uuid";

export interface IDeviceData {
  user_agent: string;
  device_id: string;
  browser_language: string;
  timezone: string;
  screen_resolution: string;
  device_details: {
    platform: string;
    mobile: boolean;
  };
}

export default function getDeviceDetails(): IDeviceData | null {
  /**
   *
   * @returns {Object|null} An object containing device and browser-related information, or null if not in a browser environment.
   */

  const details: IDeviceData = {
    user_agent: "",
    device_id: "",
    browser_language: "",
    timezone: Intl?.DateTimeFormat?.().resolvedOptions()?.timeZone || "UTC",
    screen_resolution: "",
    device_details: {
      platform: "",
      mobile: false,
    },
  };

  if (typeof window === "undefined" || typeof navigator === "undefined") return null;

  // user agent
  const uaData = (navigator as any)?.userAgentData || null;

  details.user_agent = uaData?.brands?.[0]
    ? `${uaData.brands[0].brand} version ${uaData.brands[0].version}`
    : navigator.userAgent;

  // platform
  details.device_details = {
    platform: uaData?.platform || navigator.platform || "unknown",
    mobile: uaData?.mobile ?? /Mobi|Android/i.test(navigator.userAgent),
  };

  details.browser_language =
    navigator.languages?.[0] || navigator.language || "en";

  // set device_id or collect device_id
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = uuidv4();

    localStorage.setItem("device_id", deviceId);
  }
  details.device_id = deviceId;

  // screen resolution
  details.screen_resolution = `${window.screen.width}x${window.screen.height}`;

  return details;
}

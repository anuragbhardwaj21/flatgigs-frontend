import dayjs from "dayjs";
import * as Yup from "yup";

export const searchValidationSchema = Yup.object({
  city: Yup.string().trim().required("Destination is required"),
  checkIn: Yup.string().required("Check-in is required"),
  checkOut: Yup.string()
    .required("Check-out is required")
    .test(
      "after-check-in",
      "Check-out must be after check-in",
      function validateCheckOut(checkOut) {
        const { checkIn } = this.parent as { checkIn?: string };
        if (!checkIn || !checkOut) return true;
        return dayjs(checkOut).isAfter(dayjs(checkIn), "day");
      },
    ),
  adults: Yup.number().min(1, "At least 1 guest").required(),
});

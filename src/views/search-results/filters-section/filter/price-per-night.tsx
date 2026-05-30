import { Slider } from "@mui/material";

export const MIN_PRICE = 0;
export const MAX_PRICE = 500;
export const DEFAULT_PRICE_RANGE: [number, number] = [50, 250];

const sliderSx = {
  mt: 1,
  color: "primary.main",
  "& .MuiSlider-thumb": {
    width: 14,
    height: 14,
  },
  "& .MuiSlider-rail": {
    opacity: 0.25,
    bgcolor: "primary.main",
  },
  "& .MuiSlider-track": {
    border: "none",
  },
};

const formatPrice = (value: number) =>
  value >= MAX_PRICE ? `€${value}+` : `€${value}`;

const PricePerNight = ({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) => (
  <>
    <span className="text-xs font-medium text-black/55">
      {formatPrice(value[0])} – {formatPrice(value[1])}
    </span>
    <Slider
      value={value}
      onChange={(_, next) => onChange(next as [number, number])}
      min={MIN_PRICE}
      max={MAX_PRICE}
      step={10}
      disableSwap
      valueLabelDisplay="auto"
      valueLabelFormat={formatPrice}
      sx={sliderSx}
    />
  </>
);

export default PricePerNight;

import BrandIcon from "@/components/atoms/brand-icon";
import { useIcon } from "@/hooks/use-icons";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  const IconHeart = useIcon("heart");
  const IconGraph = useIcon("graph");
  return (
    <div className="border-b border-dashed p-2 bg-background-paper">
      <div className="main-container flex items-center justify-between">
        <BrandIcon fullMode link />
        <div className="flex items-center gap-2">
          <Button
            component={Link}
            to="/wishlist"
            variant="text"
            color="primary"
            startIcon={<IconHeart className="text-xl" />}
          >
            Wishlist
          </Button>
          <Button
            component={Link}
            to="/traces"
            variant="text"
            color="primary"
            startIcon={<IconGraph className="text-xl" />}
          >
            Traces
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

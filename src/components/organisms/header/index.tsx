import BrandIcon from "@/components/atoms/brand-icon";
import { useIcon } from "@/hooks/use-icons";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  const IconHeart = useIcon("heart");
  return (
    <div className="border-b border-dashed p-2 bg-background-paper">
      <div className="main-container flex items-center justify-between">
        <BrandIcon fullMode link />
        <Button
          component={Link}
          to="/wishlist"
          variant="text"
          color="primary"
          startIcon={<IconHeart className="text-xl" />}
        >
          Wishlist
        </Button>
      </div>
    </div>
  );
};

export default Header;

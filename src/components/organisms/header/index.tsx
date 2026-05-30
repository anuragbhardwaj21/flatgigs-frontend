import BrandIcon from "@/components/atoms/brand-icon";
import { useIcon } from "@/hooks/use-icons";
import { Button } from "@mui/material";

const Header = () => {
  const IconSearch = useIcon("search");
  return (
    <div className="border-b border-dashed p-2 bg-background-paper">
      <div className="main-container flex items-center justify-between">
        <BrandIcon fullMode link />
        <Button
          variant="text"
          color="primary"
          startIcon={<IconSearch className="text-xl" />}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Header;

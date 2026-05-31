import { ListingDetailProvider } from "@/context/listing-detail";
import ListingDetailView from "@/views/listing-detail";

const ListingDetail = () => (
  <ListingDetailProvider>
    <ListingDetailView />
  </ListingDetailProvider>
);

export default ListingDetail;

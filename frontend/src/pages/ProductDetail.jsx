import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return <div>Product Detail ID: {id}</div>;
}
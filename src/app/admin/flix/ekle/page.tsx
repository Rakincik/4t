import FlixForm from "../FlixForm";
import { createFlixPackage } from "../actions";

export default function FlixEklePage() {
    return <FlixForm mode="create" onSave={createFlixPackage} />;
}

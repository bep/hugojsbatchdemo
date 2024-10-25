import { ButtonBasic } from "./button.jsx";
import "./mystyles.css";

export default function MyButton(props) {
  return <ButtonBasic label={props.label} />;
}

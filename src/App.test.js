import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home hero", () => {
  render(<App />);
  const headline = screen.getByText(/?紐꺪?/域뱀눖以??醫뤿뼢 ???삸??i);
  expect(headline).toBeInTheDocument();
});

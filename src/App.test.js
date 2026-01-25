import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home hero", () => {
  render(<App />);
  const headline = screen.getByText(/?筌뤾벳?/?잙??뽨빳???ルㅏ堉???????i);
  expect(headline).toBeInTheDocument();
});

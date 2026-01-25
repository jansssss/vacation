import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home hero", () => {
  render(<App />);
  const headline = screen.getByText(/노무\/근로 유틸 플랫폼/i);
  expect(headline).toBeInTheDocument();
});

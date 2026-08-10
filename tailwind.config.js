module.exports = {
  // components/ 를 빠뜨리면 그 폴더에서만 쓰는 클래스가 생성되지 않아
  // 색상 지정이 통째로 누락된다(예: 계산식 박스 글씨가 배경색에 묻힘).
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

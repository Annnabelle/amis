import { Input } from "antd";

type PhoneInputProps = {
  value?: string; // "сырая" версия от Form (например: 998991234567)
  onChange?: (value: string) => void;
};

const PhoneInput = ({ value = "", onChange }: PhoneInputProps) => {
  // форматируем "сырое" значение в маску
  const formatPhone = (digits: string) => {
    const limited = digits.substring(0, 12);

    let formatted = "+998";
    if (limited.length > 3) formatted += " (" + limited.substring(3, 5);
    if (limited.length >= 5) formatted += ") " + limited.substring(5, 8);
    if (limited.length >= 8) formatted += "-" + limited.substring(8, 10);
    if (limited.length >= 10) formatted += "-" + limited.substring(10, 12);

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, ""); // убираем все символы кроме цифр
    if (onChange) {
      onChange(digits); // сохраняем в Form только цифры
    }
  };

  return (
    <Input
      size="large"
      value={formatPhone(value)} // показываем маску
      onChange={handleChange}
      className="input"
      placeholder="+998 (__) ___-__-__"
      inputMode="numeric"
    />
  );
};

export default PhoneInput;





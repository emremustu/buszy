'use client'
import React, { useState, useEffect, useRef } from "react";

interface DropdownInputProps {
  placeholder: string;
  options: string[];
  inputRef: React.RefObject<HTMLInputElement>;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ placeholder, options, inputRef }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // Kullanıcı inputa yazdıkça listeyi filtrele
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    setDropdownOpen(true);
  };

  // Dropdown'dan bir seçenek seçilince
  const handleSelectOption = (option: string) => {
    setInputValue(option);
    setDropdownOpen(false);
  };

  // Ekranda başka bir yere tıklanınca dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-[28rem]">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-14 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        onFocus={() => setDropdownOpen(true)}
      />

      {dropdownOpen && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelectOption(option)}
                className="px-4 py-2 cursor-pointer hover:bg-amber-100"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;

'use client';
import { useEffect, useState } from 'react';

interface Props {
  price: number;
}

export default function FormattedPrice({ price }: Props) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    setFormatted(price.toLocaleString('vi-VN'));
  }, [price]);

  return <span>{formatted}</span>;
}

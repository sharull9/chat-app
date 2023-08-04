"use client";
import React, { Children, Component, HtmlHTMLAttributes } from "react";

type Props = {};

export default function ClientComponents({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

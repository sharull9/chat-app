"use client";
import React, { Children, Component, HtmlHTMLAttributes } from "react";

type Props = {};

export default function ClientComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

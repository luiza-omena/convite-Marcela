interface MobileDecorationsSectionProps {
  placement: "top" | "middle" | "bottom";
}

/** No mobile usamos apenas o starfield padrão do layout. */
export function MobileDecorationsSection({ placement }: MobileDecorationsSectionProps) {
  void placement;
  return null;
}

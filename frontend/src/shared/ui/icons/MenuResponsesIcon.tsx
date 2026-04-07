import { FC, SVGProps } from "react";

interface MenuResponsesIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const MenuResponsesIcon: FC<MenuResponsesIconProps> = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3.82353C6 2.49271 6 1.82682 6.4688 1.41365C6.93707 1 7.69173 1 9.2 1H10.8C12.3083 1 13.0629 1 13.5312 1.41365C14 1.82682 14 2.49271 14 3.82353V6.17647C14 7.50729 14 8.17318 13.5312 8.58635C13.0629 9 12.3083 9 10.8 9H9.2C7.69173 9 6.93707 9 6.4688 8.58635C6 8.17318 6 7.50729 6 6.17647V3.82353Z" stroke="currentColor" />
    <path d="M8.25 3.25L11.5833 6.58333" stroke="currentColor" strokeLinecap="round" />
    <path d="M11.584 3.25L8.25065 6.58333" stroke="currentColor" strokeLinecap="round" />
    <path d="M1 9.82353C1 8.49271 1 7.82682 1.4688 7.41365C1.93707 7 2.69173 7 4.2 7H5.8C7.30827 7 8.06293 7 8.5312 7.41365C9 7.82682 9 8.49271 9 9.82353V12.1765C9 13.5073 9 14.1732 8.5312 14.5864C8.06293 15 7.30827 15 5.8 15H4.2C2.69173 15 1.93707 15 1.4688 14.5864C1 14.1732 1 13.5073 1 12.1765V9.82353Z" stroke="currentColor" />
    <path d="M3 10.9995C3 10.9995 4.55828 12.5382 4.6 12.4991C4.64172 12.46 7 9.5 7 9.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

export default MenuResponsesIcon;

import { styled } from "@mui/material/styles";

const Subtitle = styled("div");

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  subtitle?: string;
  label?: string;
  state?: "success" | "error" | "disabled";
}

export const Checkbox = ({
  title,
  label,
  className,
  state,
  subtitle,
  ...props
}: CheckboxProps) => {
  const id = Math.random().toString(36).substring(2);
  return (
    <div className={className}>
      {title && <div className={"checkbox-title"}>{title}</div>}
      <div className="checkbox-inner">
        <input id={id} type="checkbox" {...props} />
        {label && (
          <label htmlFor={id}>
            <svg
              width="8"
              height="7"
              viewBox="0 0 8 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75 1.8125L2.75 6.8125L0.25 4.3125L1.1875 3.375L2.75 4.9375L6.8125 0.875L7.75 1.8125Z"
                fill="#F9F9FA"
              />
            </svg>
            <span>{label}</span>
          </label>
        )}
      </div>
      {subtitle && <div className="checkbox-subtitle">{subtitle}</div>}
    </div>
  );
};

export default styled(Checkbox)(
  ({ theme }) => `
    
    margin-bottom: 14px;
  
    & .checkbox-title {

      color: ${theme.palette.grey};
      display: block;
      margin-bottom: 6px;
    }
    
    & .checkbox-subtitle {
      margin-top: 7px;
    }
    
    & .checkbox-inner {
      display: flex;
    }
    
    & input[type="checkbox"] {
      display: none;
    }
    
    & input[type="checkbox"] + label {
      position: relative;
      display: flex;
    }
    
    & input[type="checkbox"] + label::before {
      min-width: 12px;
      min-height: 12px;
      max-width: 12px;
      max-height: 12px;
      width: 12px;
      height: 12px;
      
      content: "";
      
      border: 1px solid ${theme.palette.grey};
      margin-top: 2px;
    }
    
    & input[type="checkbox"]:checked+label::before {
      background-color: ${theme.palette.primary.main};
      
      color: ${theme.palette.grey};
    }
    
    & input[type="checkbox"] + label svg {
      position: absolute;
      fill: ${theme.palette.grey};
      left: 3px;
      top: 5px;
    }
    
    & label span {

      
      display: block;
      margin-left: 16px;
    }`
);

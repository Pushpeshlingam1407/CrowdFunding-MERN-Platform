import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.variant === 'outline' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.variant === 'outline' ? props.theme.colors.primary : '#ffffff'};
  border: ${props => props.variant === 'outline' ? `2px solid ${props.theme.colors.primary}` : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.variant === 'outline' ? `${props.theme.colors.primary}11` : props.theme.colors.accent};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 119, 182, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: #fafafa;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(0, 119, 182, 0.1);
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  border: 1px solid #f0f0f0;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '1rem'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    if (typeof props.cols === 'string' && props.cols.includes('fr')) {
      return props.cols;
    }
    return `repeat(${props.cols || 1}, 1fr)`;
  }};
  gap: ${props => props.gap || '2rem'};
  
  @media (max-width: 992px) {
    grid-template-columns: ${props => props.cols > 2 ? 'repeat(2, 1fr)' : '1fr'};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

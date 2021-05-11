import { ComponentProps } from '../common/types';

export interface Props extends ComponentProps {
	name: string;
	onChange: (newName: string) => void;
}

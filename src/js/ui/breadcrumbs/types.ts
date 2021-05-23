import File from '../../lib/utils/project-hierarchy/file';
import { IComponentProps } from '../common/types';

export interface IProps extends IComponentProps {
	cwd: File;
	onNavigate: (file: File) => void;
}
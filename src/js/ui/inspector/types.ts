import GameObject from '../../lib/utils/game-object';
import File from '../../lib/utils/project-hierarchy/file';
import { ComponentProps } from '../common/types';

export interface Props extends ComponentProps {
	selectedObject?: GameObject | File;
	onNameChange: (node: GameObject, newName: string) => void;
}

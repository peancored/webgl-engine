import styled from 'styled-components';
import { Header } from '../../../styles/common';
import { pxToRem } from '../../../styles/helpers';

export const Wrapper = styled.div``;

export const Title = styled(Header)``;

export const Info = styled.div`
	display: grid;
	--input-size: 5fr;
	grid-template-columns: 6fr 1fr var(--input-size) 1fr var(--input-size) 1fr var(
			--input-size
		);
	margin-top: ${pxToRem(10)}rem;
	grid-row-gap: ${pxToRem(5)}rem;
`;
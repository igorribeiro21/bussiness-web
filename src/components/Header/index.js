import {
    Container,
    Link,
    Span
} from './styles';
import { useState } from 'react';

function Header() {

    return (
        <Container>
            <Link href='/empresas'>
                <span style={{ color: '#fff' }}>Empresas</span>
            </Link>
            <Link href='/funcionarios'>
                <span style={{ color: '#fff' }}>Funcionários</span>
            </Link>
        </Container>
    );
}

export default Header;
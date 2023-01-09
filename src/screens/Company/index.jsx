import Header from "../../components/Header";
import { Container } from "./styles";
import { api } from '../../utils/api'
import { useEffect, useState } from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Dialog,
    DialogContent,
    TextField,
    Button
} from '@mui/material';
import {
    Visibility,
    Delete,
    AddCircle
} from '@mui/icons-material';

const styles = {
    tableHead: {
        fontWeight: 'bold'
    },
    divCompany: {
        display: 'flex'
    },
    divCreateCompany: {
        display: 'flex',
        flexDirection: 'column'
    },
    textFieldCreateCompany: {
        margin: 10,
        width: 300
    }
};

function Company() {
    const [listCompanies, setListCompanies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogExclude, setOpenDialogExclude] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [companyDialog, setCompanyDialog] = useState({});
    const [disableEdit, setDisableEdit] = useState(true);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [telephone, setTelephone] = useState('');
    const [complement, setComplement] = useState('');
    const [editDialog, setEditDialog] = useState(false);

    useEffect(() => {
        async function getCompanies() {
            const response = await api.get('/Companies');

            if (response.data) {
                setListCompanies(response.data.data);
            }
        }
        getCompanies();
    }, []);

    useEffect(() => {
        if (zipcode.length === 8) {
            getAddressCep();
        }
    }, [zipcode])

    function onCloseDialog() {
        setOpenDialog(false);
    }
    function onCloseDialogExclude() {
        setOpenDialogExclude(false);
    }
    function onCloseDialogCreate() {
        setOpenDialogCreate(false);
    }

    function clearDialog() {
        setName('');
        setStreet('');
        setNumber('');
        setNeighborhood('');
        setState('');
        setCity('');
        setTelephone('');
        setComplement('');
    }

    const formatTelephone = (v) => {
        v = v.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        return v;
    }

    async function excludeCompany() {
        const response = await api.delete(`/Companies/${companyDialog.id}`);

        if (response.data.success) {
            const responseNewList = await api.get('/Companies');

            if (responseNewList.data.success) {
                setListCompanies(responseNewList.data.data);
                setOpenDialogExclude(false);
            }
        }
    }

    async function createCompany() {
        const obj = {};
        Object.assign(obj, {
            name: name ? name : '',
            address: street && number && neighborhood && city && state && zipcode
                ? `${street} , ${number} ${complement && complement} ${neighborhood} , ${city}-${state} ${zipcode}` : '',
            telephone: telephone ? telephone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '') : ''
        });

        if (!obj.name) {
            alert('Favor preencher o nome da empresa');
            return;
        }

        if (!obj.address) {
            alert('Favor preencher todos os campos do endereço da empresa');
            return;
        }

        if (!obj.telephone) {
            alert('Favor preencher o telefone da empresa');
            return;
        }

        const response = await api.post('/Companies', obj);

        if (response.data.success) {
            alert('Empresa criada com sucesso!');
            clearDialog();
            setDisableEdit(true);

            const responseCompanies = await api.get('/Companies');

            if (responseCompanies.data.success) {
                setListCompanies(responseCompanies.data.data);
                setOpenDialogCreate(false);
            }
        }
    }

    async function getAddressCep() {
        const response = await api.get(`/Zipcode/${zipcode}`);
        if (response.data) {
            setStreet(response.data.logradouro);
            setNeighborhood(response.data.bairro);
            setCity(response.data.localidade);
            setState(response.data.uf);

            if (response.data.complemento)
                setComplement(response.data.complemento);

            setDisableEdit(false);
        }
    }

    return (
        <Container>
            <Header />
            <div>
                <div style={styles.divCompany}>
                    <h1>Empresas</h1>
                    <IconButton
                        onClick={() => setOpenDialogCreate(true)}>
                        <AddCircle color="success" />
                    </IconButton>
                </div>
                <Table>
                    <TableHead>
                        <TableCell style={styles.tableHead}>Identificador</TableCell>
                        <TableCell style={styles.tableHead}>Nome</TableCell>
                        <TableCell style={styles.tableHead}>Endereço</TableCell>
                        <TableCell style={styles.tableHead}>Telefone</TableCell>
                        <TableCell style={styles.tableHead}>Detalhes</TableCell>
                    </TableHead>
                    <TableBody>
                        {
                            listCompanies.length && listCompanies.map(company => (
                                <TableRow key={company.id}>
                                    <TableCell>{company.id}</TableCell>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>{company.address}</TableCell>
                                    <TableCell>{company.telephone && formatTelephone(company.telephone)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setCompanyDialog(company);
                                            setOpenDialog(true)
                                        }}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setCompanyDialog(company);
                                                setOpenDialogExclude(true);
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>


            <Dialog open={openDialog} onClose={onCloseDialog}>
                <DialogContent>

                    {
                        !editDialog ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <h1>{companyDialog ? companyDialog.name : ''}</h1>

                                <span><strong>Cep:</strong>{zipcode}</span>
                                <span><strong>Telefone:</strong>{formatTelephone(telephone)}</span>
                                <span><strong>Rua:</strong>{street}</span>
                                <span><strong>Número:</strong>{number}</span>
                                <span><strong>Bairro:</strong>{neighborhood}</span>
                                <span><strong>Complemento:</strong>{complement}</span>
                                <span><strong>Cidade:</strong>{city}</span>
                                <span><strong>Estado:</strong>{state}</span>
                            </div>
                        ) : (
                            <div>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Endereço"
                                    defaultValue={companyDialog && companyDialog.address}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Telefone"
                                    defaultValue={companyDialog && companyDialog.telephone ? formatTelephone(companyDialog.telephone) : ''}
                                />
                            </div>
                        )
                    }

                </DialogContent>
            </Dialog>

            <Dialog open={openDialogExclude} onClose={onCloseDialogExclude}>
                <h2>Deseja excluir a empresa {companyDialog.name}?</h2>

                <Button
                    onClick={() => excludeCompany()}
                    color="primary">Sim</Button>
                <Button
                    color="error"
                    onClick={() => onCloseDialogExclude()}
                >Não</Button>
            </Dialog>

            <Dialog
                open={openDialogCreate}
                onClose={onCloseDialogCreate}
                maxWidth="lg"
                fullWidth={true}
            >
                <div>
                    <h1 style={{ margin: 10 }}>Criar Empresa</h1>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Cep"
                            onChange={e => {
                                setZipcode(e.target.value)
                            }}
                            value={zipcode}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Telefone"
                            value={telephone}
                            onChange={e => setTelephone(formatTelephone(e.target.value))}
                        />

                    </div>

                    <div>



                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Rua"
                            disabled={disableEdit}
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                        />
                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Número"
                            onChange={e => setNumber(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Bairro"
                            disabled={disableEdit}
                            value={neighborhood}
                            onChange={e => setNeighborhood(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            id="outlined-required"
                            label="Complemento"
                            disabled={disableEdit}
                            value={complement}
                            onChange={e => setComplement(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Cidade"
                            disabled={disableEdit}
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Estado"
                            disabled={disableEdit}
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />

                    </div>
                    <Button
                        style={{
                            background: '#06b2f7',
                            height: 50,
                            width: 200,
                            color: '#fff',
                            margin: 15,
                            float: 'right',
                            marginRight: 250
                        }}
                        onClick={() => createCompany()}
                    >Criar</Button>

                </div>

            </Dialog>
        </Container >
    )
}

export default Company;
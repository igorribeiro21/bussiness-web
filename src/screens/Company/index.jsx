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
        margin: 10
    }
};

function Company() {
    const [listCompanies, setListCompanies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogExclude, setOpenDialogExclude] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [companyDialog, setCompanyDialog] = useState({});
    const [disableEdit, setDisableEdit] = useState(true);
    const [cepCreate, setCepCreate] = useState('');

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
        if(cepCreate.length === 8) {
            getAddressCep();
        }
    },[cepCreate])

    function onCloseDialog() {
        setOpenDialog(false);
    }
    function onCloseDialogExclude() {
        setOpenDialogExclude(false);
    }
    function onCloseDialogCreate() {
        setOpenDialogCreate(false);
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

    async function getAddressCep() {
        const response = await api.get(`/Zipcode/${cepCreate}`);
        if(response.data) {
            console.log(response.data);
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
                    <h1>{companyDialog ? companyDialog.name : ''}</h1>

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
                    <div>
                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Nome"
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Cep"
                            onChange={e => {
                                setCepCreate(e.target.value)                               
                            }}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Rua"
                            disabled={disableEdit}
                        />
                    </div>

                    <div>
                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Número"
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Bairro"
                            disabled={disableEdit}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Cidade"
                            disabled={disableEdit}
                        />

                        <TextField
                            style={styles.textFieldCreateCompany}
                            required
                            id="outlined-required"
                            label="Estado"
                            disabled={disableEdit}
                        />
                    </div>
                </div>

            </Dialog>
        </Container>
    )
}

export default Company;
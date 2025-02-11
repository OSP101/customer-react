import { useState, useEffect } from "react";
import {
  CircularProgress,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Box,
  Typography
} from "@mui/material";
import axios from "axios";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const baseUrl = import.meta.env.VITE_API_URL;

interface Customer {
  customerid: number;
  firstname: string;
  lastname: string;
}

interface ApiResponse {
  data: Customer[];
}

interface CustomerErrors {
  firstname: string;
  lastname: string;
}

interface ApiResponse {
  data: Customer[];
  length: number;
}

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'customerid'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<CustomerErrors>({ firstname: '', lastname: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const expectedStructure = {
    data: [
      {
        customerid: 'number',
        firstname: 'string',
        lastname: 'string'
      }
    ],
    length: 'number'
  };

  const validateStructure = (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];


    if (!data.data || !Array.isArray(data.data)) {
      errors.push('Missing or invalid "data" field');
    }
    if (typeof data.length !== 'number') {
      errors.push('Missing or invalid "length" field');
    }


    if (Array.isArray(data.data)) {
      data.data.forEach((customer: any, index: number) => {
        if (typeof customer.customerid !== 'number') {
          errors.push(`Customer ${index + 1}: Missing or invalid "customerid" field`);
        }
        if (typeof customer.firstname !== 'string') {
          errors.push(`Customer ${index + 1}: Missing or invalid "firstname" field`);
        }
        if (typeof customer.lastname !== 'string') {
          errors.push(`Customer ${index + 1}: Missing or invalid "lastname" field`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get<ApiResponse>(`${baseUrl}/api/v1/customer`);

      const { isValid, errors } = validateStructure(response.data);
      if (!isValid) {
        setApiError(`โครงสร้างข้อมูลไม่ถูกต้อง: ${errors.join(', ')}`);
        setRawResponse(response.data);
        setCustomers([]);
        return;
      }

      setCustomers(response.data.data);
      setApiError(null);
      setRawResponse(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError('เกิดข้อผิดพลาดในการดึงข้อมูล');
        setRawResponse(err.response?.data || null);
      } else {
        setApiError('เกิดข้อผิดพลาดที่ไม่คาดคิด');
        setRawResponse(null);
      }
      setCustomers([]);
    }
  };

  const handleSearch = async () => {
    if (search) {
      if (!/^\d+$/.test(search)) {
        setIdError('กรุณากรอกเฉพาะตัวเลข');
        return;
      }

      setIdError(null);
      try {
        const response = await axios.get<Customer>(`${baseUrl}/api/v1/customer/${search}`);
        setCustomers([response.data]);
        setError(null);
      } catch (err) {
        setCustomers([]);
        setError("ไม่พบลูกค้าไอดี " + search);
      }
    } else {
      fetchCustomers();
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${baseUrl}/api/v1/customer/${id}`);
    fetchCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
  };

  const handleSave = async () => {
    if (editCustomer) {
      if (!validateForm(editCustomer)) return;

      setIsSaving(true);
      try {
        await axios.put(`${baseUrl}/api/v1/customer/${editCustomer.customerid}`, editCustomer);
        setSuccess('บันทึกข้อมูลสำเร็จ!');
        setEditCustomer(null);
        fetchCustomers();
      } catch (err) {
        setError("แก้ไขข้อมูลไม่สำเร็จ");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAdd = () => {
    setNewCustomer({ firstname: '', lastname: '' });
  };

  const handleSaveAdd = async () => {
    if (newCustomer) {
      if (!validateForm(newCustomer)) return;

      setIsAdding(true);
      try {
        await axios.post(`${baseUrl}/api/v1/customer`, newCustomer);
        setSuccess('เพิ่มข้อมูลสำเร็จ!');
        setNewCustomer(null);
        fetchCustomers();
      } catch (err) {
        setError("เพิ่มข้อมูลไม่สำเร็จ");
      } finally {
        setIsAdding(false);
      }
    }
  };

  const validateForm = (customer: Omit<Customer, 'customerid'>): boolean => {
    let isValid = true;
    const newErrors: CustomerErrors = { firstname: '', lastname: '' };

    if (!customer.firstname.trim()) {
      newErrors.firstname = 'กรุณากรอกชื่อจริง';
      isValid = false;
    }

    if (!customer.lastname.trim()) {
      newErrors.lastname = 'กรุณากรอกนามสกุล';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #e3f2fd 100%)',
      py: 4
    }}>
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 2
            }}
          >
            Customer Management
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}



        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom style={{ width: '100%' }}>
              {apiError}
            </Typography>


            <Typography variant="caption" component="div" sx={{ mt: 1, width: '100%' }}>
              ข้อมูลที่ได้รับมา:
            </Typography>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              width: '100%',
              overflowX: 'auto',
              margin: '8px 0'
            }}>
              {JSON.stringify(rawResponse, null, 2)}
            </pre>


            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              โครงสร้างที่ถูกต้อง:
            </Typography>
            <pre style={{
              background: '#e3f2fd',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
              overflowX: 'auto'
            }}>
              {JSON.stringify(expectedStructure, null, 2)}
            </pre>
          </Alert>
        )}

        {!apiError && customers.length > 0 && (
          <div>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                label="Search Customer by ID"
                variant="outlined"
                fullWidth
                size="small"
                value={search}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setSearch(e.target.value);
                    setIdError(null);
                  }
                }}
                error={!!idError}
                helperText={idError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                  height: '40px',
                  alignSelf: 'center',
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAdd}
                sx={{
                  height: '40px',
                  width: '160px',
                  alignSelf: 'center',
                  borderRadius: '8px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)'
                }}
              >
                Add Customer
              </Button>
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>NO</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        <Typography variant="body1">
                          ไม่พบข้อมูลลูกค้า
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer, index) => (
                      <TableRow
                        key={customer.customerid}
                        sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{customer.firstname}</TableCell>
                        <TableCell>{customer.lastname}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(customer)}
                            sx={{ mr: 1, borderRadius: '6px' }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(customer.customerid)}
                            sx={{ borderRadius: '6px' }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {editCustomer && (
          <Dialog open onClose={() => setEditCustomer(null)}>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
              <TextField
                label="First Name"
                fullWidth
                margin="dense"
                value={editCustomer.firstname}
                onChange={(e) => {
                  setEditCustomer({ ...editCustomer, firstname: e.target.value });
                  setErrors(prev => ({ ...prev, firstname: '' }));
                }}
                error={!!errors.firstname}
                helperText={errors.firstname}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="dense"
                value={editCustomer.lastname}
                onChange={(e) => {
                  setEditCustomer({ ...editCustomer, lastname: e.target.value });
                  setErrors(prev => ({ ...prev, lastname: '' }));
                }}
                error={!!errors.lastname}
                helperText={errors.lastname}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setEditCustomer(null)}
                disabled={isSaving}
                sx={{ color: '#666' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                disabled={isSaving}
                startIcon={isSaving && <CircularProgress size={20} />}
                sx={{ fontWeight: 'bold' }}
              >
                {isSaving ? 'กำลังบันทึก...' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {newCustomer && (
          <Dialog open onClose={() => setNewCustomer(null)}>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                value={newCustomer.firstname}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, firstname: e.target.value });
                  setErrors(prev => ({ ...prev, firstname: '' }));
                }}
                error={!!errors.firstname}
                helperText={errors.firstname}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                value={newCustomer.lastname}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, lastname: e.target.value });
                  setErrors(prev => ({ ...prev, lastname: '' }));
                }}
                error={!!errors.lastname}
                helperText={errors.lastname}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setNewCustomer(null)}
                disabled={isAdding}
                sx={{ color: '#666' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAdd}
                color="primary"
                disabled={isAdding}
                startIcon={isAdding && <CircularProgress size={20} />}
                sx={{ fontWeight: 'bold' }}
              >
                {isAdding ? 'กำลังเพิ่ม...' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        )}


        <Box
          component="footer"
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            <img
              src="https://spring.io/img/spring.svg"
              alt="Spring Boot"
              style={{ height: 30 }}
            />
            <img src={viteLogo} alt="Vite" style={{ height: 30 }} />
            <img src={reactLogo} alt="React" style={{ height: 30 }} />
            <img
              src="https://mui.com/static/logo.png"
              alt="MUI"
              style={{ height: 30 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Developed by OSP101 | Powered by Spring Boot + Vite + React + Material-UI
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Teaching media for SC363204 Java Web Application Development. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default App;
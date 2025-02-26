import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
////
import Swal from 'sweetalert2';
////
import './AdminDashboard.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [userHistory, setUserHistory] = useState([]);
  const [modificationHistory, setModificationHistory] = useState([]);
  const [telecomModificationHistory, setTelecomModificationHistory] = useState([]);
  const [telephoneLineModificationHistory, setTelephoneLineModificationHistory] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const handleNavigation = (path) => {
    history.push(path);
  };

  const fetchAdminList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/admin/admin-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminList(data);
      } else {
        console.error('Failed to fetch admin list');
      }
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/admin/user-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserHistory(data);
      } else {
        console.error('Failed to fetch user history');
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
    }
  };


  const fetchModificationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/it-equipments/admin/it-equipment-modifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.filter(mod => mod.field !== 'createdAt' && mod.field !== 'updatedAt');
        setModificationHistory(filteredData);
      } else {
        console.error('Failed to fetch modification history');
      }
    } catch (error) {
      console.error('Error fetching modification history:', error);
    }
  };

  const fetchTelecomModificationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telecom-packs/admin/telecom-pack-modifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Telecom Modifications:', data);
        setTelecomModificationHistory(data);
      } else {
        console.error('Failed to fetch telecom modification history');
      }
    } catch (error) {
      console.error('Error fetching telecom modification history:', error);
    }
  };

  // Fetch Telephone Line modification history
  const fetchTelephoneLineModificationHistory = async () => {
    try {
      console.log('Fetching Telephone Line modification history...'); // Debugging statement
      const response = await fetch(`${API_URL}/api/telephone-lines/admin/telephone-line-modifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Telephone Line Modifications:', data); // Debugging statement
        if (data.length === 0) {
          console.log('No modification records found'); // Debugging statement
        } else {
          data.forEach(mod => {
            console.log('Modification Record:', JSON.stringify(mod, null, 2)); // Debugging statement for each record
          });
        }
        setTelephoneLineModificationHistory(data);
      } else {
        console.error('Failed to fetch telephone line modification history, status:', response.status); // Debugging statement
      }
    } catch (error) {
      console.error('Error fetching telephone line modification history:', error); // Debugging statement
    }
  };

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('token');
      if (!token) {
        history.push('/login');
      }
    }
  }, [loading, history]);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
      fetchModificationHistory();
      fetchTelecomModificationHistory();
      fetchTelephoneLineModificationHistory();
      fetchAdminList(); // Fetch admin list when the component mounts
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // New admin functionalities
  const handleRemoveUser = async (email) => {
    console.log('Removing user with email:', email); // Log the email to ensure it's captured correctly
    if (!email) {
      console.error('No email provided');
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_URL}/api/users/${email}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 204) {
          console.log('User removed successfully');
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been removed successfully.',
          });
          setUserHistory(userHistory.filter(user => user.email !== email));
        } else {
          console.error('Failed to remove user:', response.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to remove user: ${response.statusText}`,
          });
        }
      } catch (error) {
        console.error('Error removing user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error removing user: ${error.message}`,
        });
      }
    }
  };

  const handleValidateUser = async (email) => {
    console.log('Validating user with email:', email); // Log the email to ensure it's captured correctly
    if (!email) {
      console.error('No email provided');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will validate the user's account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, validate it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/api/users/validate/${email}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          Swal.fire('Validated!', 'User account has been validated.', 'success');
          setUserHistory(userHistory.map(user =>
            user.email === email ? { ...user, isValidated: true } : user
          )); // Update the validation status in the state
        } else {
          Swal.fire('Error!', 'Failed to validate user account.', 'error');
        }
      } catch (error) {
        console.error('Error validating user account:', error);
        Swal.fire('Error!', 'Failed to validate user account.', 'error');
      }
    }
  };


  const handleChangePassword = async (email) => {
    console.log('Changing password for user with email:', email); // Log the email to ensure it's captured correctly
    if (!email) {
      console.error('Email not provided');
      return;
    }

    // Prompt for the new password with visible text
    const { value: newPassword } = await Swal.fire({
      title: 'Enter new password',
      input: 'text', // Change this to 'text' to show the password directly
      inputLabel: 'New Password',
      inputPlaceholder: 'Enter the new password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a password!';
        }
      }
    });

    if (!newPassword) {
      console.error('New password not provided');
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will change the user's password.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/api/users/password`, {
          email,
          newPassword
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          console.log('Password changed successfully');
          Swal.fire({
            icon: 'success',
            title: 'Changed!',
            text: 'User password has been changed successfully.',
          });
        } else {
          console.error('Failed to change password:', response.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to change password: ${response.statusText}`,
          });
        }
      } catch (error) {
        console.error('Error changing password:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error changing password: ${error.message}`,
        });
      }
    }
  };

  const handleRoleChange = async (email, newRole) => {
    console.log('Changing role for user with email:', email); // Log the email to ensure it's captured correctly
    if (!email || !newRole) {
      console.error('Email or new role not provided');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will change the user's role to ${newRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/api/users/role`, {
          email,
          newRole
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          console.log('Role changed successfully');
          Swal.fire({
            icon: 'success',
            title: 'Changed!',
            text: 'User role has been changed successfully.',
          });
          fetchUserHistory(); // Refresh user history
        } else {
          console.error('Failed to change role:', response.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to change role: ${response.statusText}`,
          });
        }
      } catch (error) {
        console.error('Error changing role:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error changing role: ${error.message}`,
        });
      }
    }
  };

  const handleResetModificationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/it-equipments/admin/it-equipment-modifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setModificationHistory([]); // Clear the modification history in the state
        console.log('Modification history reset successfully');
      } else {
        console.error('Failed to reset modification history');
      }
    } catch (error) {
      console.error('Error resetting modification history:', error);
    }
  };

  const handleResetTelecomModificationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telecom-packs/admin/telecom-pack-modifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setTelecomModificationHistory([]);
        console.log('Telecom Pack modification history reset successfully');
      } else {
        console.error('Failed to reset Telecom Pack modification history');
      }
    } catch (error) {
      console.error('Error resetting Telecom Pack modification history:', error);
    }
  };

  const handleResetTelephoneLineModificationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telephone-lines/admin/telephone-line-modifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setTelephoneLineModificationHistory([]);
        console.log('Telephone Line modification history reset successfully');
      } else {
        console.error('Failed to reset Telephone Line modification history');
      }
    } catch (error) {
      console.error('Error resetting Telephone Line modification history:', error);
    }
  };

  const handleDropTable = async (table) => {
    const result = await Swal.fire({
      title: `Êtes-vous sûr de vouloir supprimer la table ${table}?`,
      text: "Cette action ne peut pas être annulée.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la !'
    });

    if (result.isConfirmed) {
      try {
        let requestUrl = '';
        if (table === 'it-equipments') {
          requestUrl = `${API_URL}/api/it-equipments/admin/drop-it-equipments-table`;
        } else if (table === 'telecom-pack') {
          requestUrl = `${API_URL}/api/telecom-packs/admin/drop-telecom-packs-table`;
        } else if (table === 'telephone-lines') {
          requestUrl = `${API_URL}/api/telephone-lines/admin/drop-telephone-lines-table`;
        }

        console.log(`Request URL: ${requestUrl}`);

        const response = await axios.delete(requestUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log("Response:", response);

        if (response.status === 204) {
          Swal.fire(
            'Supprimée !',
            `La table ${table} a été supprimée.`,
            'success'
          );
        } else {
          console.error(`Échec de la suppression de la table ${table} : ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression de la table ${table} :`, error.message);
        Swal.fire(
          'Error!',
          `Erreur lors de la suppression de la table ${table} : ${error.message}`,
          'error'
        );
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-content">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>

        <div className="admin-profile-section">
          <h2>Liste des Administrateurs</h2>
          {adminList.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {adminList.map((admin, index) => (
                    <tr key={index}>
                      <td>{admin.email}</td>
                      <td>{admin.fullName}</td>
                      <td>{formatDate(admin.lastLogin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun administrateur disponible.</p>
          )}
        </div>

        <div className="admin-user-history-section">
          <h2>Historique de connexion utilisateur</h2>
          {userHistory.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userHistory.map((user, index) => (
                    <tr key={index}>
                      <td>{user.email}</td>
                      <td>{user.fullName}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        {!user.isValidated ? (
                          <button
                            onClick={() => handleValidateUser(user.email)}
                            disabled={user.isValidated}
                            className={user.isValidated ? 'validated-button' : 'action-button validate-button'}
                          >
                            {user.isValidated ? '✅ Validated' : 'Validate'}
                          </button>
                        ) : (
                          <span className="validated-status">✅ Validated</span>
                        )}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.email, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="action-button change-password-button" onClick={() => handleChangePassword(user.email)}>Change Password</button>
                        <button className="action-button remove-button" onClick={() => handleRemoveUser(user.email)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun historique de connexion utilisateur disponible.</p>
          )}
        </div>

        <div className="admin-modification-history-section">
          <h2>Historique des modifications de Matériel informatique</h2>
          <button onClick={handleResetModificationHistory} className="reset-button">Réinitialiser</button>
          {user.role === 'admin' && (
            <button onClick={() => handleDropTable('it-equipments')} className="drop-button">
              Supprimer la table
            </button>
          )}
          {modificationHistory.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Temps de Modification</th>
                    <th>Champ</th>
                    <th>Ancienne Valeur</th>
                    <th>Nouvelle Valeur</th>
                    <th>Série</th>
                  </tr>
                </thead>
                <tbody>
                  {modificationHistory.map((modification, index) => (
                    <tr key={index}>
                      <td>{modification.User.fullName}</td>
                      <td>{modification.User.email}</td>
                      <td>{formatDate(modification.modifiedAt)}</td>
                      <td>{modification.field}</td>
                      <td>{modification.oldValue}</td>
                      <td>{modification.newValue}</td>
                      <td>{modification.ITEquipment.serie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun historique de modification de Matériel Informatique disponible.</p>
          )}
        </div>

        <div className="admin-modification-history-section">
          <h2>Historique des modifications du Parc Télécom</h2>
          <button onClick={handleResetTelecomModificationHistory} className="reset-button">Réinitialiser</button>
          {user.role === 'admin' && (
            <button onClick={() => handleDropTable('telecom-pack')} className="drop-button">
              Supprimer la table
            </button>
          )}
          {telecomModificationHistory.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Temps de Modification</th>
                    <th>Champ</th>
                    <th>Ancienne Valeur</th>
                    <th>Nouvelle valeur</th>
                    <th>Entité</th>
                  </tr>
                </thead>
                <tbody>
                  {telecomModificationHistory.map((modification, index) => (
                    <tr key={index}>
                      <td>{modification.User.fullName}</td>
                      <td>{modification.User.email}</td>
                      <td>{formatDate(modification.modifiedAt)}</td>
                      <td>{modification.field}</td>
                      <td>{modification.oldValue ? modification.oldValue : 'N/A'}</td>
                      <td>{modification.newValue ? modification.newValue : 'N/A'}</td>
                      <td>{modification.TelecomPack.entite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun historique de modification du Parc Télécom disponible.</p>
          )}
        </div>

        <div className="admin-modification-history-section">
          <h2>Historique des modifications des Lignes Téléphoniques</h2>
          <button onClick={handleResetTelephoneLineModificationHistory} className="reset-button">Réinitialiser</button>
          {user.role === 'admin' && (
            <button onClick={() => handleDropTable('telephone-lines')} className="drop-button">
              Supprimer la table
            </button>
          )}
          {telephoneLineModificationHistory.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Temps de Modification</th>
                    <th>Champ</th>
                    <th>Ancienne Valeur</th>
                    <th>Nouvelle valeur</th>
                    <th>Numéro de GSM</th>
                  </tr>
                </thead>
                <tbody>
                  {telephoneLineModificationHistory.map((modification, index) => (
                    <tr key={index}>
                      <td>{modification.User.fullName}</td>
                      <td>{modification.User.email}</td>
                      <td>{formatDate(modification.modifiedAt)}</td>
                      <td>{modification.field}</td>
                      <td>{modification.oldValue ? modification.oldValue : 'N/A'}</td>
                      <td>{modification.newValue ? modification.newValue : 'N/A'}</td>
                      <td>{modification.TelephoneLine.numero_de_gsm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun historique de modification de Ligne Téléphonique disponible.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

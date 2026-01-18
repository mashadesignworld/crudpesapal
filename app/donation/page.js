// app/donation/page.js
import Navbar from '@/components/Navbar';
import { sanityClient } from '../../lib/sanity'; // Adjust path as needed


async function getDonation() {
  try {
    const query = `
      *[_type == "donation" && status in ["completed", "pending"]] | order(createdAt desc) {
        donorName,
        phoneNumber,
        amount,
        transactionId,
        status,
        createdAt,
        _id // Make sure to fetch the _id for the key
      }
    `;
    const donation = await sanityClient.fetch(query);
    return donation;
  } catch (error) {
    console.error('Error fetching donations from Sanity:', error);
    return []; // Or throw the error if you want to handle it differently
  }
}

export default async function donation() {
  const donation = await getDonation();

  return (
    <>
    <Navbar />
    <div style={{ padding: '20px' }}>
        <h1>Recent Donations</h1>
        {donation.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {donation.map((donation) => (
              <li
                key={donation._id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <strong style={{ fontWeight: 'bold', color: '#333' }}>
                  Donor:
                </strong>{' '}
                {donation.donorName || 'Anonymous'}
                <br />
                <strong style={{ fontWeight: 'bold', color: '#333' }}>
                  Amount:
                </strong>{' '}
                {donation.amount}
                {donation.phoneNumber && (
                  <>
                    <br />
                    <strong style={{ fontWeight: 'bold', color: '#333' }}>
                      Phone:
                    </strong>{' '}
                    {donation.phoneNumber}
                  </>
                )}
                <br />
                <strong style={{ fontWeight: 'bold', color: '#333' }}>
                  Transaction ID:
                </strong>{' '}
                {donation.transactionId}
                <br />
                <strong
                  style={{
                    fontWeight: 'bold',
                    color: donation.status === 'completed' ? 'green' : 'orange',
                  }}
                >
                  Status:
                </strong>{' '}
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                <br />
                <strong style={{ fontWeight: 'bold', color: '#333' }}>
                  Donated At:
                </strong>{' '}
                {new Date(donation.createdAt).toLocaleDateString()} {' '}
                {new Date(donation.createdAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations received yet.</p>
        )}
      </div>
      
    </>
  );
}
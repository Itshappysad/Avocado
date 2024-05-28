import { Col, Row } from 'react-bootstrap';
import { StoreItem } from '../components/StoreItem';
import { type Product } from '../core/types';
import { useEffect, useState } from 'react';
import { getProducts } from '../core/database';
import { toast } from 'sonner';

export function Store() {
  const [storeItems, setStoreItems] = useState<Product[] | null>(null);

  useEffect(() => {
    const run = async () => {
      const products = await getProducts();

      if (!products) {
        return toast.error('Ha ocurrido un error');
      }

      setStoreItems(products);
    };

    run();
  }, []);

  return (
    <>
      <h1 className='text-center'>Tienda principal</h1>
      <Row md={2} xs={1} lg={2} className='g-3'>
        {storeItems?.map(item => (
          <Col key={item.id}>
            <StoreItem product={item} />
          </Col>
        ))}
      </Row>
    </>
  );
}

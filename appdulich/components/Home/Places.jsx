import React from 'react';

import {
  View,
  VirtualizedList,
} from 'react-native';

import { SIZES } from '../../constants/theme.js';
import HeightSpacer from '../Reusable/HeightSpacer.jsx';
import Country from '../Tiles/Country/Country.jsx';

const Places = () => {
  const countries = [
      {
        "_id": "1",
        "country": "Hạ Long",
        "description": "Hạ Long Bay, một trong bảy kỳ quan thiên nhiên thế giới, nổi tiếng với hàng nghìn hòn đảo đá vôi hùng vĩ và hệ sinh thái đa dạng. Du khách có thể khám phá hang động kỳ bí, chèo kayak qua các vịnh nhỏ và thưởng thức hải sản tươi ngon.",
        "imageUrl": "https://travelsgcc.com/wp-content/uploads/2020/07/vinh-ha-long-vao-danh-sach-50-ky-quan-thien-nhien-dep-nhat-the-gioi.jpeg",
        "region": "Quảng Ninh, Việt Nam"
      },
      {
        "_id": "2",
        "country": "Hà Giang",
        "description": "Sapa nằm ở vùng núi Tây Bắc, nổi tiếng với ruộng bậc thang tuyệt đẹp và bản làng dân tộc thiểu số. Du khách có thể trekking qua những thung lũng hùng vĩ và chiêm ngưỡng đỉnh Fansipan, nóc nhà Đông Dương.",
        "imageUrl": "https://mia.vn/media/uploads/blog-du-lich/goi-y-ban-15-hoat-dong-kham-pha-sapa-tu-tuc-danh-cho-team-cuong-chan-6-1624898382.jpg",
        "region": "Lào Cai, Việt Nam"
      },
     
      {
        "_id": "3",
        "country": "Đà Lạt",
        "description": "Đà Lạt, thành phố mộng mơ với khí hậu mát mẻ quanh năm, nổi tiếng với những đồi chè xanh mướt, rừng thông bạt ngàn và vô số điểm du lịch lãng mạn. Đây là điểm đến lý tưởng cho những ai yêu thiên nhiên và sự yên bình.",
        "imageUrl": "https://luhanhtour.com/wp-content/uploads/2019/01/h%C3%ACnh-n%E1%BB%81n-%C4%91%C3%A0-l%E1%BA%A1t.png",
        "region": "Lâm Đồng, Việt Nam"
      },
      {
        "_id": "4",
        "country": "Quảng Nam",
        "description": "Hội An, thành phố cổ kính với những ngôi nhà vàng rực rỡ và đèn lồng lung linh. Nơi đây là sự kết hợp hoàn hảo giữa lịch sử, văn hóa và ẩm thực độc đáo, mang đến trải nghiệm khó quên cho du khách.",
        "imageUrl": "https://datviettour.com.vn/uploads/images/mien-trung/hoi-an/hinh-danh-thang/du-lich-hoi-an-800px.jpg",
        "region": "Quảng Nam, Việt Nam"
      },
      {
        "_id": "5",
        "country": "Thanh Hóa",
        "description": "Bãi biển Sầm Sơn là một trong những điểm đến du lịch biển nổi tiếng nhất miền Bắc Việt Nam. Với bãi cát vàng mịn, sóng biển mạnh và ẩm thực biển phong phú, Sầm Sơn thu hút hàng triệu du khách mỗi năm.",
        "imageUrl": "https://bizweb.dktcdn.net/100/081/807/articles/bien-sam-son-thanh-hoa.jpg?v=1541670060107",
        "region": "Thanh Hóa, Việt Nam"
      }
  ]

  return (
    <View> 
      <HeightSpacer height={10} /> 
      {/* chỉ render các phần tử hiển thị trên màn hình thay vì toàn bộ danh sách. */}
      <VirtualizedList               
        data={countries} // Danh sách dữ liệu chứa thông tin các quốc gia
        horizontal // Hiển thị danh sách theo chiều ngang
        keyExtractor={(item) => item._id} // Định danh duy nhất cho mỗi item bằng _id
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
        getItemCount={(data) => data.length} // Xác định số lượng phần tử trong danh sách
        getItem={(data, index) => data[index]} // Lấy phần tử tại vị trí index trong danh sách
        renderItem={({ item, index }) => ( // Render từng item trong danh sách
          <View style={{ marginRight: SIZES.medium }}> 
          
           {/* <Text>{item.country}</Text>         */}
           <Country item={item} />
          </View>
        )}
      />
    </View>
  );
  
  
}

export default Places
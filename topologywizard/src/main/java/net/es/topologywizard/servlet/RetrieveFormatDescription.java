package net.es.topologywizard.servlet;


import org.apache.xerces.parsers.*;
import org.w3c.dom.Document;

import java.lang.*;
import java.net.MalformedURLException;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;
import java.util.zip.*;

import javax.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import net.sf.json.xml.XMLSerializer;

import org.apache.geronimo.mail.util.QuotedPrintable;
import org.apache.xerces.impl.dv.dtd.NMTOKENDatatypeValidator;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;
import org.w3c.dom.*;
import org.xml.sax.SAXException;

import com.uwyn.jhighlight.renderer.XhtmlRendererFactory;

public class RetrieveFormatDescription extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{
		res.setContentType("text/html");
		
		PrintWriter out = res.getWriter();
		
		
		String p_method = req.getParameter("method");
		
		try 
		{
			String topofileName = null;
			
			if(p_method.equals("getFormatTree"))
			{
				topofileName = req.getParameter("topologyName");				
			
			
				if(topofileName.contains(".nmwg"))
				{
		    	  
					String NMWGContent = this.retrieveNMWGXML(topofileName);
		    	   	
					out.print(NMWGContent);
		    	   
		    	   
				}
				else if(topofileName.contains(".nml"))
				{
					out.print("<h1>NML Format Unsupported</h1>");
				}
		    } 	
		    
		    out.close();
		}
		finally
		{
			
		}

		
	}
	
	
	public String retrieveNMWGXML(String topofileName)
	{
		

		try
		{
					
            TransformerFactory transfac = TransformerFactory.newInstance();
            
            Transformer trans = transfac.newTransformer();
            trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            trans.setOutputProperty(OutputKeys.INDENT, "yes");
			
            StringWriter sw;
            StreamResult result;
            DOMSource source;
            String topoFormatString;
            
            Document parse_doc;
            
	        File topoFormatFile = new File(topofileName);
		     
	
            
            DOMParser parser = new DOMParser();
            
            parser.parse(topoFormatFile.toURL().toString());
            
            parse_doc = parser.getDocument( );

            
			
			sw = new StringWriter();
            result = new StreamResult(sw);
            source = new DOMSource(parse_doc);
            trans.transform(source, result);
            topoFormatString = sw.toString();

			
			
			
	        topoFormatString = XhtmlRendererFactory.getRenderer(XhtmlRendererFactory.XML).highlight("Topology Description in NMWG Format for OSCARS", topoFormatString,"UTF-8", false);        
			
	        return topoFormatString;
        
		}
		catch(SAXException saxex)
		{
			
		}
		catch(TransformerException traex)
		{
			
		}
		catch(MalformedURLException murlex)
		{
			
		}
		catch(IOException ioex)
		{
			
		}
		
		return "<h2>error in loading the topology schema document</h2>";
        
	}

}